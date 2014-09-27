class HashTag < ActiveRecord::Base
  has_and_belongs_to_many :videos
  validates :name, presence: true, length: { maximum: 200 }
  validates_associated :videos
end
